'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }) {
    /*
    const plugin = strapi.plugin('upload')
    const originalUpload = plugin.services['upload'].upload
     
    plugin.services['upload'].upload = async (args) => {

      const result = await originalUpload(args)

      result[0].edwadwadadawdwa = true
      return result

    }
      */
},
};
