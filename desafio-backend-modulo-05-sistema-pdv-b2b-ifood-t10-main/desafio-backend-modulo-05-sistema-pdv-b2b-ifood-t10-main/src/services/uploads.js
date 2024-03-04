const aws = require('aws-sdk');

const {
    Upload
} = require('@aws-sdk/lib-storage');

const {
    S3
} = require('@aws-sdk/client-s3');

const endpoint = new aws.Endpoint(process.env.ENDPOINT_BACKBLAZE);

const s3 = new S3({
    // The transformation for endpoint is not implemented.
    // Refer to UPGRADING.md on aws-sdk-js-v3 for changes needed.
    // Please create/upvote feature request on aws-sdk-js-codemod for endpoint.
    endpoint,

    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
});

const uploadImage = async (path, buffer, mimetype) => {
    const imagem = await new Upload({
        client: s3,

        params: {
            Bucket: process.env.BUCKET_NAME,
            Key: path,
            Body: buffer,
            ContentType: mimetype
        }
    }).done();

    return {
        path: imagem.Key,
        url: `https://${process.env.BUCKET_NAME}.${process.env.ENDPOINT_BACKBLAZE}/${imagem.Key}`
    }
};

const deleteImage = async (path) => {
    await s3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: path
    })
};

module.exports = {
    uploadImage,
    deleteImage
};