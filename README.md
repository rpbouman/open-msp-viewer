open-msp-viewer
===============

Open MS Project viewer - a pure HTML5 viewer for MS Project files.

![A screenshot of the open msp viewer](https://raw.githubusercontent.com/rpbouman/open-msp-viewer/master/doc/open-msp-viewer.png "A screenshot of the open msp viewer")

Using
-----
To use the open msp viewer, download the [msp-viewer.zip](https://github.com/rpbouman/open-msp-viewer/blob/master/dist/msp-viewer.zip?raw=true "Open MS Project viewer distribution") archive.
Unpack the archive, and use your web browser to open resources/html/index.html. This is a sample application that lets you load MS Project XML files via the browser file API, which is supported on all modern web browsers, and on Internet Explorer starting from version 10.

The sample application also has an option to open a MS Project file using HTTP (use the folder icon on the toolbar). However, this option is subject to the standard same-origin policy of the XMLHttpRequest.

The sample application also shows how you can embed the open msp viewer into your own webapplications. See the "Developers" section for more details.

Developers
----------
Please refer the sample application in the resources/html/index.html folder to see how to use the open msp viewer in your webpages.