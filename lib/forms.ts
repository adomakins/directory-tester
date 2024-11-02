'use server'

import { Client } from '@notionhq/client'

export default async function submitFormData(formData: FormData, siteId: string, type: 'subscribe' | 'contact') {

    // Create notion client
    const notion = new Client({ auth: process.env.NOTION_INTEGRATION_TOKEN });
    const databaseId = process.env[`NOTION_CONTACTS_DATABASE`];

    // Get form data
    const email = formData.get('email')?.toString();
    let message, info;
    if (type === 'contact') {
        message = formData.get('message')?.toString();
        info = formData.get('info')?.toString();
    }

    // Throw errors if databaseId or email is not found
    if (!databaseId) {
        console.error('Database ID not found!')
        return { status: 'error', message: 'Database ID not found!' }
    } else if (!email) {
        console.error('Email not found!')
        return { status: 'error', message: 'Email not found!' }
    } else {
        // console.log(email, siteId);
    }

    try {
        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": databaseId
            },
            "properties": {
                "Email": {
                    "title": [
                        {
                            "text": {
                                "content": email
                            }
                        }
                    ]
                },
                "Type": {
                    "select": {
                        "name": type.charAt(0).toUpperCase() + type.slice(1)
                    }
                },
                "Directory": {
                    "relation": [
                        {
                            "id": siteId
                        }
                    ]
                },
                ...(type === 'contact' && message ? {
                    "Contact Message": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": message
                                }
                            }
                        ]
                    }
                } : {}),
                ...(type === 'contact' && info ? {
                    "Additional Info": {
                        "rich_text": [
                            {
                                "text": {
                                    "content": info
                                }
                            }
                        ]
                    }
                } : {})
            }
        })
    } catch (error) {
        console.error('Form submission failed!', error)
        return { status: 'error', message: 'Form submission failed!' }
    }

    return { status: 'success', message: 'Form submitted successfully!' }
}
