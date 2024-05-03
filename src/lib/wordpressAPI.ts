import FormData from 'form-data';
import fs from 'fs';
import { config } from '../../config';
import fetch from 'node-fetch';
/**
 * Creates a new post with the given title, content, and image.
 *
 * @param {string} title - The title of the post.
 * @param {string} contentHtml - The HTML content of the post.
 * @param {fs.PathLike} imagePath - The path to the image file.
 * @return {Promise<void>} A promise that resolves when the post is created successfully.
 */
export const createPost = async (title: string, contentHtml: string, imagePath: any,categoryId:number): Promise<void> => {
  try {
    const siteUrl = config.siteUrl;
    const restApiUrl = `${siteUrl}/wp-json/wp/v2`;
    const formData:any = new FormData();
    formData.append("file", fs.createReadStream(imagePath), {
        filename: `image${Date.now()}.jpg`,
        contentType: "image/jpeg",
    });

    const mediaResponse = await fetch(`${restApiUrl}/media`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.Authorization_Key}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });
    if (!mediaResponse.ok) throw new Error('Media upload failed');
    const media = await mediaResponse.json();

    const postData = {
      title,
      content: contentHtml,
      status: 'publish',
      categories: [2, 3],
      tags: [4, 5],
      featured_media: media.id,
    };

    const postResponse = await fetch(`${restApiUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.Authorization_Key}`,
      },
      body: JSON.stringify(postData),
    });

    if (!postResponse.ok) throw new Error('Post creation failed');
    const post = await postResponse.json();
    
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

export const showCategories = async (id: number): Promise<any> => {
  const response = await fetch(`${config.siteUrl}/wp-json/wp/v2/categories`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.Authorization_Key}`,
    }
  });
  const data = await response.json();
  const normalizeData = data.map((item: any) => {
    if(item.id === id) return item.name
  })
  return normalizeData
}

export const getCategories = async (): Promise<any> => {
  const response = await fetch(`${config.siteUrl}/wp-json/wp/v2/categories`,{
    method: 'GET',
    headers: {
      Authorization: `Bearer ${config.Authorization_Key}`,
    }
  });
  const data = await response.json();
  const normalizeData = data.map((item: any) => {
    return {id: item.id, name: item.name}
  })
  return normalizeData
}