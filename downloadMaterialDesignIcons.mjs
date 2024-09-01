import { createWriteStream } from 'fs';
import { promisify } from 'util';
import stream from 'stream';

const pipeline = promisify(stream.pipeline);

const token = process.env.GITHUB_TOKEN;

const defaultPath =
	'https://api.github.com/repos/google/material-design-icons/git/trees/66ecf0ecc97e5a6f417987bd2d4cd2817ba2371f';
const iconStyle = 'materialsymbolsrounded';
const iconModifiers = '_fill1_24px.svg';

async function fetchWithRetry(url, retries = 3) {
	try {
		await handleRateLimit();
		return await fetchContent(url);
	} catch (err) {
		if (retries === 0) {
			throw err;
		}

		console.log(`Retrying... (${retries} attempts left)`);
		await sleep(5000);
		
		return fetchWithRetry(url, retries - 1);
	}
}

async function fetchContent(url) {
	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Accept: 'application/vnd.github+json',
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
	}

	const data = await response.json();
	return data;
}

async function handleRateLimit() {
	const response = await fetch('https://api.github.com/rate_limit', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	const data = await response.json();
	const remaining = data.rate.remaining;
	const resetTime = data.rate.reset;

	if (remaining <= 1) {
		const waitTime = (resetTime - Math.floor(Date.now() / 1000)) * 1000;
		console.log(`Rate limit hit. Waiting for ${waitTime / 1000} seconds...`);
		await sleep(waitTime);
	}
}

async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
	const getAllIcons = await fetchWithRetry(defaultPath);
	for (const item of getAllIcons.tree) {
		const getIconStyles = await fetchWithRetry(item.url);
		for (const styleItem of getIconStyles.tree) {
			if (styleItem.path === iconStyle) {
				const getIconModifiers = await fetchWithRetry(styleItem.url);
				for (const modItem of getIconModifiers.tree) {
					if (modItem.path.includes(iconModifiers)) {
						const getIcon = await fetchWithRetry(modItem.url);
						const iconBuffer = Buffer.from(getIcon.content, 'base64');

						await pipeline(
							stream.Readable.from([iconBuffer]),
							createWriteStream(modItem.path)
						);

						console.log(`Saved icon: ${modItem.path}`);
					}
				}
			}
		}
	}
}

main().catch((err) => console.error('Error in main function:', err));