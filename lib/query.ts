import { Client } from '@notionhq/client'
import { PageObjectResponse, QueryDatabaseParameters } from '@notionhq/client/build/src/api-endpoints'

export default async function notionQuery(databaseName: string, filter?: QueryDatabaseParameters['filter'], sorts?: QueryDatabaseParameters['sorts']) {
  const databaseId = process.env[`NOTION_${databaseName.toUpperCase()}_DATABASE`];
  const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });

  if (!databaseId) {
    throw new Error('Database ID not found!')
  }

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: filter,
    sorts: sorts
  });

  // Logging statement for debugging
  // if (databaseName === 'articles' && filter) {
  //   console.log(JSON.stringify(response, null, 2));
  // }

  async function mapProperties(page: PageObjectResponse) {
    const properties: { [key: string]: any } = {};
    properties['id'] = page.id;

    for (const [key, value] of Object.entries(page.properties)) {
      const lowercaseKey = key.toLowerCase();
      switch (value.type) {
        case 'title':
          properties[lowercaseKey] = value.title[0]?.plain_text ?? '' as string;
          break;
        case 'rich_text':
          properties[lowercaseKey] = value.rich_text[0]?.plain_text ?? '' as string;
          break;
        case 'relation':
          properties[lowercaseKey] = value.relation.map(rel => rel.id).join(',') ?? '' as string;
          // Only fetch related pages data when the relation property is named 'type'
          if (key.toLowerCase() === 'subtypes' && value.relation.length > 0) {
            const relatedPages = await Promise.all(
              value.relation.map(async rel => {
                const relatedPage = await notion.pages.retrieve({ page_id: rel.id });
                if ('properties' in relatedPage) {
                  return mapProperties(relatedPage as PageObjectResponse);
                }
                return null;
              })
            );
            properties[`${lowercaseKey}_data`] = relatedPages.filter(page => page !== null);
          }
          break;
        case 'url':
          properties[lowercaseKey] = value.url ?? '' as string;
          break;
        case 'select':
          properties[lowercaseKey] = value.select?.name ?? '' as string;
          break;
        case 'files':
          const fileObj = value.files[0];
          if (fileObj) {
            properties[lowercaseKey] = 'file' in fileObj
              ? fileObj.file.url
              : fileObj.external?.url ?? '' as string;
          } else {
            properties[lowercaseKey] = '' as string;
          }
          break;
        case 'date':
          properties[lowercaseKey] = value.date?.start ?? '' as string;
          break;
        case 'checkbox':
          properties[lowercaseKey] = value.checkbox.toString() ?? '' as string;
          break;
        case 'people':
          properties[lowercaseKey] = value.people.map(person => 'name' in person ? person.name : '').join(', ') ?? '' as string;
          break;
        case 'last_edited_time':
          properties[lowercaseKey] = value.last_edited_time ?? '' as string;
          break;
        case 'number':
          properties[lowercaseKey] = value.number?.toString() ?? '0' as string;
          break;
        case 'rollup':
          if (value.rollup.type === 'number') {
            properties[lowercaseKey] = value.rollup.number?.toString() ?? '0' as string;
          } else if (value.rollup.type === 'array') {
            properties[lowercaseKey] = value.rollup.array
              .map(item => {
                if ('title' in item) return item.title[0]?.plain_text ?? '';
                if ('rich_text' in item) return item.rich_text[0]?.plain_text ?? '';
                if ('number' in item) return item.number?.toString() ?? '0';
                return '';
              })
              .join(', ') as string;
          } else {
            properties[lowercaseKey] = '' as string;
          }
          break;
      }
    }

    return properties;
  }

  const results = await Promise.all(
    response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(mapProperties)
  );

  return results;
}