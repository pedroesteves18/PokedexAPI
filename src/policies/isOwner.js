'use strict';

module.exports = async (policyContext, config, { strapi }) => {
    const { user } = policyContext.state;
    const { id } = policyContext.params;

    if (!user) {
        return false;
    }

    if (!id) {
        return true;
    }

    if (id && id.toString() === user.id.toString()) {
        return true;
    }
    return false;
}; 