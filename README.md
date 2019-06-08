# Viewing Photos in an Amazon S3 Bucket from a Browser

This litte project builds on the [AWS JavaScript example of the same name](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html). The major difference is that by the use of CloudFormation, you can get the sample up and running in a few minutes.

## Disclaimer

This sample is not intended for use as-is. If you deploy it -

* It is insecure - HTTP only access.
* It is public - Anyone with the URL can view all images you place in the photo bucket.

## Minor changes to Amazon's Sample

By and large, it is the same as the Amazon sample; note the naming convetion for image files on their page, however

* The photo bucket is non-public. The JavaScript generates a pre-signed URL to access the content.

## Cloudformation Template

The provided template deploys all the resources described in the AWS example. Two optional input parameters may be used

1. `PhotoBucketPrefix` - Prefixes the name of the S3 bucket created to contain photo albums. It defaults to `photo-albums`
1. `WebsiteBucketPrefix` - Prefixes the name of the S3 bucket created to host the web site files. It defaults to `photo-website`

## Deploying the Sample

You will need to install and configure the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html) for your platform.

1. Deploy the CloudFormation Template using either the AWS console or your favourite CloudFormation deployment mechanism (plug: [PSCloudFormation](https://github.com/fireflycons/PSCloudFormation))
1. In the CloudFormation console, find the stack you deployed and go to the output tab. You'll need all the values here.
1. Edit `web/PhotoViewer.js`, find the lines commented `**DO THIS**` and follow instructions in the comment.
1. Optionally edit `web/index.html`, find the line commented `**DO THIS**` and update the JavaScript API version.
1. Open a command shell and use AWS CLI to upload the web and album artifacts. Paste in the appropriate stack outputs in the script below first.
```
cd web
aws s3 sync . PhotoBucketS3Url_from_stack_outputs
cd ../album
aws s3 sync . WebsiteBucketS3Url_from_stack_outputs
```
6. Browse your new site by visiting the URL in the stack output `WebsiteURL`.

## Sample Images

The sample images included in this repo were obtained from [Free-Images.com](https://free-images.com/)

