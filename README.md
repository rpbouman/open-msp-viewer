open-msp-viewer
===============

Open MS Project viewer - a pure HTML5 viewer for MS Project files.

![A screenshot of the open msp viewer](https://raw.githubusercontent.com/rpbouman/open-msp-viewer/master/doc/open-msp-viewer.png "A screenshot of the open msp viewer")

Using
-----
To use the open msp viewer, download the [msp-viewer.zip](https://github.com/rpbouman/open-msp-viewer/blob/master/dist/msp-viewer.zip?raw=true "Open MS Project viewer distribution") archive.
Unpack the archive, and use your web browser to open resources/html/index.html.
This is a sample application that lets you load MS Project XML files via the browser file API, which is supported on all modern web browsers, and on Internet Explorer starting from version 10.

The sample application also has an option to open a MS Project file using HTTP (use the folder icon on the toolbar). However, this option is subject to the standard same-origin policy of the XMLHttpRequest.

The sample application also shows how you can embed the open msp viewer into your own webapplications. See the "Developers" section for more details.

Supported MS Project File formats
---------------------------------
The open-msp-viewer can handle only the XML format as exported by MS Project. There are a few sample files in the sample directory which you can use to test.

If you run into trouble loading a particular XML file created by MS Project, please file an issue and please attach a minimal version of the file that reproduces the problem.
Please clearly state with wich version of MS project you created the file.

If you manipulate MS Project XML Files outside of MS Project, and you experience problems loading the file in the open-msp-viewer, but not in MS Project itself, then we're interested to learn about that too.
In those cases, please clearly state the nature of the modification. Attach the file that won't load. Please also load the file in MS Project, re-export, and attach that as well so that we can discover any differences.

If you have a need to load .msp files, or other file formats, please add a comment to [issue 10](https://github.com/rpbouman/open-msp-viewer/issues/10 "Ability to open .mpp files (binary) #10") and explain your requirements.
As this is a not-for profit open source project, we cannot make any guarantees. However, we can always negotiate some conditions that do give you guarantees.

Developers
----------
Please refer the sample application in the resources/html/index.html folder to see how to use the open msp viewer in your webpages.