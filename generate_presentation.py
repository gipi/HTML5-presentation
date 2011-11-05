#!/usr/bin/env python
#
# This script generates a HTML5 page with a presentation using
# a YAML file, an audio file and a image directory. Very inspired
# by this post <http://www.toolness.com/wp/?p=772>.
#
# It's possible to generate an audio file from a text file
# using text2wave (from festival package). You can create
# with the following pipeline
#
#	echo -n 'very cool text to speech' | \
#		text2wave | ffmpeg2theora - -o audio.ogg

import sys, yaml,jinja2

DEFAULT_IMAGE_DIR = 'images/'


def usage(arg_zero):
	sys.stderr.write('usage: %s config.yaml\n' % arg_zero)
	sys.exit(1)

def create_html(dictionary):
	env = jinja2.Environment(loader=jinja2.FileSystemLoader('.'))
	template = env.get_template('template-presentation.html')
	return template.render(**dictionary[0])

if __name__ == '__main__':
	if len(sys.argv) < 2:
		usage(sys.argv[0])
	
	config_file_name = sys.argv[1]

	config_file = open(config_file_name)
	print create_html(yaml.load(config_file))
