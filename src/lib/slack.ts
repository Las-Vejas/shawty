import { SLACK_WEBHOOK_URL } from '$env/static/private';

// Send Slack notification
export const sendSlackAlert = async (user: any, attemptedUrl: string, action: 'create' | 'update') => {
    if (!SLACK_WEBHOOK_URL) {
        console.warn('SLACK_WEBHOOK_URL not configured, skipping Slack notification');
        return;
    }

    const displayName = user.first_name && user.last_name 
        ? `${user.first_name} ${user.last_name}` 
        : user.name || user.email;

    const slackMention = user.slack_id ? `<@${user.slack_id}>` : displayName;

    const message = {
        text: `🚨 Loop Protection Alert`,
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "🚨 Attempted Self-Referencing Link",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*User:*\n${slackMention}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Action:*\n${action === 'create' ? 'Create new link' : 'Update existing link'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Email:*\n${user.email || 'N/A'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `*Slack ID:*\n${user.slack_id || 'N/A'}`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*Attempted URL:*\n\`${attemptedUrl}\``
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `Blocked at ${new Date().toISOString()}`
                    }
                ]
            }
        ]
    };

    try {
        await fetch(SLACK_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        });
    } catch (err) {
        console.error('Failed to send Slack notification:', err);
    }
};
