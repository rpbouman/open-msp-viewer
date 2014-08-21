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
The open-msp-viewer can handle only the XML format as exported by MS Project.
This XML format is also known as mspdi (MS Project Data Interchange).
This is [latest documentation](http://msdn.microsoft.com/en-us/library/bb428843(v=office.12).aspx) for the format pertains to MS Project 2007.
XML Schemas for this format can be found [here](http://schemas.microsoft.com/project/2007/).

The open-msp-viewr ships with a few sample files in the sample directory which you can use to test.

If you run into trouble loading a particular XML file created by MS Project, please file an issue and please attach a minimal version of the file that reproduces the problem.
Please clearly state with wich version of MS project you created the file.

If you manipulate MS Project XML Files outside of MS Project, and you experience problems loading the file in the open-msp-viewer, but not in MS Project itself, then we're interested to learn about that too.
In those cases, please clearly state the nature of the modification. Attach the file that won't load. Please also load the file in MS Project, re-export, and attach that as well so that we can discover any differences.

If you have a need to load .msp files, or other file formats, please add a comment to [issue 10](https://github.com/rpbouman/open-msp-viewer/issues/10 "Ability to open .mpp files (binary) #10") and explain your requirements.
As this is a not-for profit open source project, we cannot make any guarantees. However, we can always negotiate some conditions that do give you guarantees.

Supported MS Project versions
-----------------------------
Technically, the open-msp-viewer does not support any version of MS Project.
Currently open-msp-viewer reads and renders mspdi files.
MS Project 2002 througj 2013 support reading and writing mspdi files.
The format has been fairly constant.
The open-msp-viewer should be able to read any mspdi file created by MS Project 2002 through MS Projcet 2012.

Supported Browsers
------------------
Open msp viewer is tested against the following browsers:
- Chrome (current version) on Ubuntu Linux 13.10 and Windows 7
- Firefox (current version) on Ubuntu Linux 13.10 and Windows 7
- IE8, IE9, IE10, IE11 on Windows7
- Opera 12.16 on Ubuntu Linux 13.10 and Opera 23.0 on Windows 7

This simply reflects the platforms I have at my disposal.
If you're interested in support for other browser please post an issue.
If there is enough demand for a particular browser we can try and figure out a way to start supporting it.

Developers
----------
Please refer the sample application in the resources/html/index.html folder to see how to use the open msp viewer in your webpages.