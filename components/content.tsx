import { Client } from '@notionhq/client'
import { ListBlockChildrenResponse } from '@notionhq/client/build/src/api-endpoints'
import Image from 'next/image'

export default async function Content({ page }: { page: string }) { // Page ID
    const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });
    
    async function getAllBlocks(blockId: string): Promise<ListBlockChildrenResponse['results']> {
        let blocks: ListBlockChildrenResponse['results'] = [];
        let cursor: string | undefined;
        
        while (true) {
            const response: ListBlockChildrenResponse = await notion.blocks.children.list({
                block_id: blockId,
                start_cursor: cursor,
            });
            
            blocks = [...blocks, ...response.results];
            
            if (!response.has_more) break;
            cursor = response.next_cursor || undefined;
        }
        
        return blocks;
    }

    function renderRichText(richText: any[]) {
        return richText.map((text, index) => {
            const { annotations, plain_text, href } = text;
            const style: any = {
                fontWeight: annotations.bold ? 'bold' : 'normal',
                fontStyle: annotations.italic ? 'italic' : 'normal',
                textDecoration: annotations.strikethrough ? 'line-through' : annotations.underline ? 'underline' : 'none',
            };

            const content = href ? (
                <a href={href} key={index} style={style} className="text-blue-500 hover:underline">
                    {plain_text}
                </a>
            ) : (
                <span key={index} style={style}>
                    {plain_text}
                </span>
            );

            return content;
        });
    }

    function renderBlock(block: any) {
        const { type, id } = block;
        const value = block[type];

        switch (type) {
            case 'paragraph':
                return (
                    <p key={id} className="mb-4">
                        {renderRichText(value.rich_text)}
                    </p>
                );
            case 'heading_1':
                return (
                    <h2 key={id} className="text-2xl font-bold mb-4 mt-6">
                        {renderRichText(value.rich_text)}
                    </h2>
                );
            case 'heading_2':
                return (
                    <h3 key={id} className="text-xl font-bold mb-3 mt-4">
                        {renderRichText(value.rich_text)}
                    </h3>
                );
            case 'heading_3':
                return (
                    <h4 key={id} className="text-lg font-bold mb-2 mt-2">
                        {renderRichText(value.rich_text)}
                    </h4>
                );
            case 'bulleted_list_item':
                return (
                    <li key={id} className="mb-1">
                        {renderRichText(value.rich_text)}
                    </li>
                );
            case 'numbered_list_item':
                return (
                    <li key={id} className="ml-6 mb-1">
                        {renderRichText(value.rich_text)}
                    </li>
                );
            case 'image':
                const src = value.type === 'external' ? value.external.url : value.file.url;
                const caption = value.caption ? value.caption[0]?.plain_text : '';
                return (
                    <figure key={id} className="my-4">
                        <Image src={src} alt={caption} width={800} height={600} className="rounded-lg md:max-w-[400px] border border-gray-200" />
                        {caption && <figcaption className="text-sm text-gray-500 mt-2">{caption}</figcaption>}
                    </figure>
                );
            default:
                return (
                    <p key={id} className="mb-4">
                        Unsupported block type: {type}
                    </p>
                );
        }
    }

    // Fetch all blocks
    const blocks = await getAllBlocks(page);

    return (
        <article className="prose mx-auto">
            {blocks.map(renderBlock)}
        </article>
    )
}