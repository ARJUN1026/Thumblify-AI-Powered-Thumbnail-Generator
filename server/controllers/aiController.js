const Thumbnail = require("../models/Thumbnail");
const User = require("../models/User");
const {
  optimizePrompt,
  buildImageUrl,
  normalizeSourceImageUrl,
  canUseSourceImageForGeneration,
  warmImageUrl,
} = require("../utils/thumbnailHelpers");

const generateThumbnail = async (req, res, next) => {
  try {
    // destructure from req.body:
    //   title, style, colors (default: []), aspectRatio (default: "16:9"),
    //   prompt as extraPrompt (default: ""), sourceImage (default: ""),
    //   changeRequest (default: ""), mode (default: "generate")

    // if !title → 400 "Title is required"
    // if req.user.credits <= 0 → 400 "No credits left"

    // normalizedSourceImage → normalizeSourceImageUrl(sourceImage)
    // usableSourceImage → canUseSourceImageForGeneration ? normalizedSourceImage : ""

    // optimizedPrompt → await optimizePrompt({ title, style, colors, aspectRatio,
    //                                          extraPrompt, sourceImage, changeRequest, mode })

    // rawImageUrl → buildImageUrl(optimizedPrompt, aspectRatio, { mode, sourceImage })
    // imageUrl    → await warmImageUrl(rawImageUrl)

    // thumbnail → Thumbnail.create({ userId, title, style, colors, aspectRatio,
    //                                prompt, originalPrompt, imageUrl, sourceImage, mode })

    // updatedUser → User.findByIdAndUpdate → $inc credits by -1, select("-password")

    // return 201 → { success, message, thumbnail, credits: updatedUser.credits }
    const {
      title,
      style,
      colors = [],
      aspectRatio = "16:9",
      prompt: extraPrompt = "",
      sourceImage = "",
      changeRequest = "",
      mode = "generate",
    } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Title is required" });
    }

    if (req.user.credits <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "No credits left" });
    }

    const normalizedSourceImage = normalizeSourceImageUrl(sourceImage);
    const usableSourceImage = canUseSourceImageForGeneration(
      normalizedSourceImage,
    )
      ? normalizedSourceImage
      : "";

    const optimizedPrompt = await optimizePrompt({
      title,
      style,
      colors,
      aspectRatio,
      extraPrompt,
      sourceImage: usableSourceImage,
      changeRequest,
      mode,
    });

    const rawImageUrl = buildImageUrl(optimizedPrompt, aspectRatio, {
      mode,
      sourceImage: usableSourceImage,
    });
    const imageUrl = await warmImageUrl(rawImageUrl);

    const thumbnail = await Thumbnail.create({
      userId: req.user._id,
      title,
      style,
      colors,
      aspectRatio,
      prompt: optimizedPrompt,
      originalPrompt: extraPrompt,
      imageUrl,
      sourceImage: normalizedSourceImage,
      mode,
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { credits: -1 } },
      { new: true },
    ).select("-password");

    return res.status(201).json({
      success: true,
      message: "Thumbnail generated",
      thumbnail,
      credits: updatedUser.credits,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateThumbnail,
};
