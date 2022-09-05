Frontend compiler for node.js

Steps before work:
1. Install Node.js to you system https://nodejs.org/uk/
2. Open console in this folder
3. Run in console: npm install (will be installed all necessary modules in the folder node_modules)
4. File "gulp_conf.json" have paths for compiling  
   First string: for get scss "scss_src" : ["../src/scss/*.scss"],
   Next string: for get js "js_src" : ["../src/js/*.js"]
   Warning: 
	- All paths prescribe from the current folder
	- All files (.js, .scss ) will be compiled exception files containing (_ or . or !) at beginning of the name file
5. Run in console:  
		gulp scss_watch --gulpfile "full path to the file on the disk/gulpfile_sass.js"
		gulp js_watch --gulpfile "full path to the file on the disk/gulpfile_js.js"
   Warning: 
	- These commands will launch an automatic compilation when you change any source file.
	- Do not close the console, it will turn off the compilation	
	

	