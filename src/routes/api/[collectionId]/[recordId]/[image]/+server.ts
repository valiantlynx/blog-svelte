import sharp from 'sharp';
import type { RequestHandler } from './$types';
import { getImageURL } from '$lib/utils/api';

export const GET: RequestHandler = async ({ url, params }) => {
	const imageUrl = getImageURL(params.collectionId, params.recordId, params.image)
	|| '';
	const width = Number(url.searchParams.get('width')) || 500;
	const height = Number(url.searchParams.get('height')) || 300;
	const quality = Number(url.searchParams.get('quality')) || 100;

	try {
		// Fetch the image
		const response = await fetch(imageUrl, {
			method: 'GET',
			headers: {
				'Content-Type': 'image/jpeg',
				'Access-Control-Allow-Origin': '*'
			}
		});

		if (!response.ok) {
			throw new Error('Failed to fetch image');
		}

		// Read the image data as ArrayBuffer
		const imageArrayBuffer = await response.arrayBuffer();

		// Process the image using sharp
		const compressedImageBuffer = await sharp(imageArrayBuffer)
			.resize(width, height)
			.rotate()
			.webp({ quality })
			.toBuffer();

		return new Response(compressedImageBuffer, {
			headers: {
				'Content-Type': 'image/webp',
				'Access-Control-Allow-Origin': '*',
				'Cache-Control': `public, s-maxage=${60 * 60 * 24 * 365}`
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ message: 'Failed to compress image', error }), {
			status: 500
		});
	}
};
