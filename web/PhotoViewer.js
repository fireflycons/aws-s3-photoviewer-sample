/**
 * Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * This file is licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License. A copy of
 * the License is located at
 *
 * http://aws.amazon.com/apache2.0/
 *
 * This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations under the License.
 *
 */

/*
  MODIFICATIONS FROM ORIGINAL

  In function viewAlbum() the URL to access images is now generated as a pre-signed URL.

*/


// snippet-comment:[These are tags for the AWS doc team's sample catalog. Do not remove.]
// snippet-sourcedescription:[s3_PhotoViewer.js demonstrates how to allow viewing of photos in albums stored in an Amazon S3 bucket.]
// snippet-service:[s3]
// snippet-keyword:[JavaScript]
// snippet-keyword:[Amazon S3]
// snippet-keyword:[Code Sample]
// snippet-sourcetype:[full-example]
// snippet-sourcedate:[2019-05-07]
// snippet-sourceauthor:[AWS-JSDG]

// ABOUT THIS JAVASCRIPT SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
// https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/s3-example-photos-view.html

// snippet-start:[s3.JavaScript.s3_PhotoViewer.complete]
//
// Data constructs and initialization.
//

// snippet-start:[s3.JavaScript.s3_PhotoViewer.config]
// **DO THIS**:
//   Replace BUCKET_NAME with the "PhotoBucket" output value from the CloudFormation stack.
//
var albumBucketName = 'BUCKET_NAME';

// **DO THIS**:
// Replace the next code line in its entirety with the "AuthenticationCode" output value from the CloudFormation stack.
//
// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'eu-west-1'; AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: 'eu-west-1:7b7dc95f-afd8-4395-81cb-9e7ed6a225d5'});

// Create a new service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {Bucket: albumBucketName}
});

// A utility function to create HTML.
function getHtml(template) {
  return template.join('\n');
}
// snippet-end:[s3.JavaScript.s3_PhotoViewer.config]


//
// Functions
//

// snippet-start:[s3.JavaScript.s3_PhotoViewer.listAlbums]
// List the photo albums that exist in the bucket.
function listAlbums() {
  s3.listObjects({Delimiter: '/'}, function(err, data) {
    if (err) {
      return alert('There was an error listing your albums: ' + err.message);
    } else {
      var albums = data.CommonPrefixes.map(function(commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace('/', ''));
        return getHtml([
          '<li>',
            '<button style="margin:5px;" onclick="viewAlbum(\'' + albumName + '\')">',
              albumName,
            '</button>',
          '</li>'
        ]);
      });
      var message = albums.length ?
        getHtml([
          '<p>Click on an album name to view it.</p>',
        ]) :
        '<p>You do not have any albums. Please Create album.';
      var htmlTemplate = [
        '<h2>Albums</h2>',
        message,
        '<ul>',
          getHtml(albums),
        '</ul>',
      ]
      document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
    }
  });
}
// snippet-end:[s3.JavaScript.s3_PhotoViewer.listAlbums]

// snippet-start:[s3.JavaScript.s3_PhotoViewer.viewAlbum]
// Show the photos that exist in an album.
function viewAlbum(albumName) {
  var albumPhotosKey = encodeURIComponent(albumName) + '/_';
  s3.listObjects({Prefix: albumPhotosKey}, function(err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // 'this' references the AWS.Response instance that represents the response

    var photos = data.Contents.map(function(photo) {
      var photoKey = photo.Key;
      var params = {Bucket: albumBucketName, Key: photo.Key};
      var photoUrl = s3.getSignedUrl('getObject', params);
      console.log('The URL is', photoUrl);
        return getHtml([
        '<span>',
          '<div>',
            '<br/>',
            '<img style="width:128px;height:128px;" src="' + photoUrl + '"/>',
          '</div>',
          '<div>',
            '<span>',
              photoKey.replace(albumPhotosKey, ''),
            '</span>',
          '</div>',
        '</span>',
      ]);
    });
    var message = photos.length ?
      '<p>The following photos are present.</p>' :
      '<p>There are no photos in this album.</p>';
    var htmlTemplate = [
      '<div>',
        '<button onclick="listAlbums()">',
          'Back To Albums',
        '</button>',
      '</div>',
      '<h2>',
        'Album: ' + albumName,
      '</h2>',
      message,
      '<div>',
        getHtml(photos),
      '</div>',
      '<h2>',
        'End of Album: ' + albumName,
      '</h2>',
      '<div>',
        '<button onclick="listAlbums()">',
          'Back To Albums',
        '</button>',
      '</div>',
    ]
    document.getElementById('viewer').innerHTML = getHtml(htmlTemplate);
  });
}
// snippet-end:[s3.JavaScript.s3_PhotoViewer.viewAlbum]
// snippet-end:[s3.JavaScript.s3_PhotoViewer.complete]