const replyData = () => ({
    content: [],
    deleteContent: false,
    discord: {
        title: undefined,
        description: undefined,
        fields: [],
        footer: undefined,
    },
    outcome: {
        attackers: [],
        defender: {},
    },
});

module.exports = { replyData };
