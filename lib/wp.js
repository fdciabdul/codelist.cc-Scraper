const fetch = require("node-fetch");
const FormData = require("form-data");
const fs = require("fs");
const config = require("../config");
const createPost = async (title, contentHtml, imagePath) => {
        try {
                const siteUrl = config.siteUrl;
                const restApiUrl = `${siteUrl}/wp-json/wp/v2`;

                // Upload image to media library
                const formData = new FormData();
                formData.append("file", fs.createReadStream(imagePath), {
                        filename: `image${Date.now()}.jpg`,
                        contentType: "image/jpeg",
                });
                const mediaResponse = await fetch(`${restApiUrl}/media`, {
                        method: "POST",
                        headers: {
                                Authorization: `Basic ${config.Authorization_Key}`,
                        },
                        body: formData,
                });
                const media = await mediaResponse.json();
                const imageId = media.id;
                const imageUrl = media.source_url;

                // Create post
                const postData = {
                        title: title,
                        content: contentHtml,
                        status: "publish",
                        categories: [2, 3],
                        tags: [4, 5],
                        featured_media: imageId,
                };
                const postResponse = await fetch(`${restApiUrl}/posts`, {
                        method: "POST",
                        headers: {
                                "Content-Type": "application/json",
                                Authorization: `Basic ${config.Authorization_Key}`,
                        },
                        body: JSON.stringify(postData),
                });
                const post = await postResponse.json();
                console.log(`Post created with ID :  ${post.id} and Title : ${title}`);
        }
        catch (error) {
                console.error("Error creating post:", error);
        }
};

module.exports = createPost;
