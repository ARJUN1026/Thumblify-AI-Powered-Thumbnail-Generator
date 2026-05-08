const Thumbnail = require("../models/Thumbnail");
const ALLOWED_IMAGE_HOSTS = new Set([
  "image.pollinations.ai",
  "pollinations.ai",
]);
// ALLOWED_IMAGE_HOSTS → Set of permitted hostnames for proxy

const getUserThumbnails = async (req, res, next) => {
  try {
    const thumbnails = await Thumbnail.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, thumbnails });
    // find thumbnails by req.user._id, sorted by createdAt desc
    // return 200 → { success, thumbnails }
  } catch (error) {
    next(error);
  }
};

const deleteThumbnail = async (req, res, next) => {
  try {
    const thumbnail = await Thumbnail.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!thumbnail) {
      return res
        .status(404)
        .json({ success: false, message: "Thumbnail not found" });
    }

    return res.json({ success: true, message: "Thumbnail deleted" });
    // findOneAndDelete by req.params.id and req.user._id
    // if not found → 404 "Thumbnail not found"
    // return 200 → { success, message: "Thumbnail deleted" }
  } catch (error) {
    next(error);
  }
};

const getCommunityFeed = async (req, res, next) => {
  try {
    const thumbnails = await Thumbnail.find({ visibility: "public" })
      .sort({ createdAt: -1 })
      .limit(24)
      .populate("userId", "name");

    const trendingIdeas = [
      "MrBeast-style challenge thumbnail",
      "Cinematic podcast cover layout",
      "Gaming highlight with neon glow",
      "Finance breakdown with bold contrast",
      "Fitness transformation split-screen",
    ];

    return res.json({ success: true, thumbnails, trendingIdeas });
    // find public thumbnails, sorted by createdAt desc, limit 24, populate userId with name
    // trendingIdeas → static array of 5 idea strings
    // return 200 → { success, thumbnails, trendingIdeas }
  } catch (error) {
    next(error);
  }
};

const proxyThumbnailImage = async (req, res, next) => {
  try {
    // if no url in req.query → 400 "Image URL is required"
    // parse url → if invalid → 400 "Invalid image URL"
    // if protocol not http/https → 400 "Unsupported image protocol"
    // if hostname not in ALLOWED_IMAGE_HOSTS → 400 "Image host is not allowed"
    // fetch the url → if not ok → return upstream status
    // buffer response, set Content-Type and Cache-Control headers
    // return buffered image
    const { url } = req.query;

    if (!url) {
      return res
        .status(400)
        .json({ success: false, message: "Image URL is required" });
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(url);
    } catch (error) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid image URL" });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported image protocol" });
    }

    if (!ALLOWED_IMAGE_HOSTS.has(parsedUrl.hostname)) {
      return res
        .status(400)
        .json({ success: false, message: "Image host is not allowed" });
    }

    const response = await fetch(parsedUrl.toString());

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Unable to load thumbnail image",
      });
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const cacheControl = response.headers.get("cache-control");

    res.setHeader("Content-Type", contentType);

    if (cacheControl) {
      res.setHeader("Cache-Control", cacheControl);
    }

    return res.send(buffer);
  } catch (error) {
    next(error);
  }
};

const likeThumbnail = async (req, res, next) => {
  try {
    // findByIdAndUpdate req.params.id → $inc likes by 1
    // if not found → 404 "Thumbnail not found"
    // return 200 → { success, likes: thumbnail.likes
    const thumbnail = await Thumbnail.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!thumbnail) {
      return res.status(404).json({ success: false, message: "Thumbnail not found" });
    }

    return res.json({ success: true, likes: thumbnail.likes });
  
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserThumbnails,
  deleteThumbnail,
  getCommunityFeed,
  proxyThumbnailImage,
  likeThumbnail,
};
