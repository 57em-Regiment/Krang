import axios from 'axios';
import * as cheerio from 'cheerio';
import { createItemSchema, Faction, CategorySchema, SuperClassSchema, ClassSchema } from '@57eme-regiment/krang-api-contract';
import type { CreateItem } from '@57eme-regiment/krang-api-contract';
import { type ApiClient } from './api.js';

const get = (url: string) => {
	return axios.get(url, {
		headers: {
			'User-Agent': 'Scrapper Bot/1.0',
		},
	});
};

const getAllPageTitles = async (): Promise<string[]> => {
	let continueToken = '';
	const titles: string[] = [];

	while (true) {
		let url = `https://foxhole.wiki.gg/api.php?action=query&list=allpages&aplimit=500&apfilterredir=nonredirects&format=json`;
		if (continueToken) {
			url += `&apcontinue=${encodeURIComponent(continueToken)}`;
		}

		try {
			const response = await get(url);
			const data = response.data;
			
			if (data.query && data.query.allpages) {
				const batch = data.query.allpages.map((p: any) => p.title);
				titles.push(...batch);
			}
			
			if (data.continue && data.continue.apcontinue) {
				continueToken = data.continue.apcontinue;
				console.log(`Next page titles batch...`);
			} else {
				console.log('No more pages to fetch.');
				break;
			}
		} catch (error: any) {
			console.error('Error fetching from Wiki API:', error.message);
			break;
		}
	}

	console.log(`Total titles collected: ${titles.length}`);
	return titles;
};

const transformUrl = (url: string): string => {
	const regex = /File:([^/?#]+)/;
	const match = url.match(regex);

	const filename = match ? match[1] : null;
	return filename ? `https://foxhole.wiki.gg/images/${filename}` : '';
};

const getItemInfo = async (title: string) => {
	while(true) {
		try {
			const url = `https://foxhole.wiki.gg/api.php?action=parse&page=${encodeURIComponent(title)}&prop=text&format=json`;
			const response = await get(url);
			
			if (response.data.error) {
				return undefined;
			}
			
			if (!response.data.parse || !response.data.parse.text || !response.data.parse.text['*']) {
				return undefined;
			}
	
			const html = response.data.parse.text['*'];
			const $ = cheerio.load(html);
			const infoBox = $('aside.portable-infobox');
			
			if (infoBox.length === 0) return undefined;
	
			const getInfoBoxText = (source: string, isFirst: boolean = false) => {
				const el = infoBox.find(`div[data-source="${source}"]`).children();
				return (isFirst ? el.first() : el.last()).text();
			};

			const itemName = infoBox.children().first().text();
			const faction = infoBox.hasClass("pi-theme-War") ? Faction.WARDEN : infoBox.hasClass("pi-theme-Col") ? Faction.COLONIAL : Faction.NEUTRAL;
			const itemImageUrl = infoBox.children().find('a.image').attr('href') || '';
				
			const chassisText = getInfoBoxText('ChassisName', true);
			const chassis = getInfoBoxText('ChassisName');
			const typeText = getInfoBoxText('type', true);
			const type = getInfoBoxText('type');
			const crateAmount = parseInt(getInfoBoxText('crate_amount')) || 0;
			const categoryRaw = getInfoBoxText('category').toUpperCase().trim().replace(/-|&|\/| /g, '_');
			const disableThreshold = getInfoBoxText('disable');
				
			let category;
			let superClass;
			let class_;
			
			const rawChassis = chassis.toUpperCase().trim().replace(/-|&|\/| /g, '_') || '';
			const rawType = type.toUpperCase().trim().replace(/-|&|\/| /g, '_') || '';

			const superClassRaw = chassisText === "Super Class" ? rawChassis : typeText === "Super Class" ? rawType : 'NONE';
			const classRaw = chassisText === "Class" ? rawChassis : typeText === "Class" ? rawType : 'NONE';

			try {
				category = CategorySchema.parse(categoryRaw === "" && disableThreshold !== "" ? 'VEHICLE' : categoryRaw);
			} catch (e) {
				console.error(`Error parsing category (${categoryRaw}) for ${title}`);
				return undefined;
			}
			
			try {
				superClass = SuperClassSchema.parse(superClassRaw);
			} catch (e) {
				console.error(`Error parsing super class (${superClassRaw}) for ${title}`);
				return undefined;
			}
			
			try {
				class_ = ClassSchema.parse(classRaw);
			} catch (e) {
				console.error(`Error parsing class (${classRaw}) for ${title}`);
				return undefined;
			}
			
			const maxQuantity = categoryRaw === "MATERIAL" && (superClassRaw === "LIQUID" || superClassRaw === "LARGE_MATERIAL") ? 300 : 100;
			
			const itemInfo: CreateItem = {
				name: itemName,
				shortName: undefined,
				category: category!,
				superClass: superClass!,
				class: class_!,
				faction: faction,
				nbByCrate: crateAmount,
				maxQuantity: maxQuantity,
				icon: transformUrl(itemImageUrl),
				attributes: {},
			};
	
			return itemInfo;
		} catch (e: any) {
			// the API has a rate limit that we hit about ~120 requests every minute.
			// with this loop, it will eventually finish but it'll take time.
			console.error(`Error fetching item info for ${title}:`, e.message, `Retrying in 10 seconds...`);
			await sleep(10000);
		}
	}
};

export async function scrapWiki(api: ApiClient) {
	let titles: string[] = [];
	try {
		titles = await getAllPageTitles();
	} catch (e) {
		console.error('Error fetching titles:', e);
		return;
	}

	
	const total = titles.length;
	for (const [index, title] of titles.entries()) {
		if (!title) continue;

		const itemInfo = await getItemInfo(title);
		if (itemInfo) {
			console.log(`[${index + 1}/${total}] Processing ${title}...`);
			try {
				const parsedItem = createItemSchema.parse(itemInfo);
				await api.item.upsert({
					body: parsedItem,
				});
			} catch (e) {
				console.error(`Validation error for ${title}:`, e);
			}
		} else {
			console.error(`[${index + 1}/${total}] Ignoring ${title}.`);
		}
	}
}

function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
