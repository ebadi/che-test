import os
import json
import datetime
import mistune
from shutil import copyfile
from jinja2 import Template

BASE_DIR = os.getcwd()
PAGE_DIR = os.path.join(BASE_DIR, 'pages')
POST_DIR = os.path.join(BASE_DIR, 'posts')
OUTPUT_DIR = os.path.join(BASE_DIR, 'blog')
BLOG_DIR = os.path.join(OUTPUT_DIR, 'posts')
STYLES_DIR = os.path.join(BASE_DIR, 'styles')
TEMPLATE_DIR = os.path.join(BASE_DIR, 'templates')
CONFIG = json.load(open(os.path.join(BASE_DIR, 'config.json')))

atts = {}
atts['year'] = datetime.datetime.now().year
atts['blog'] = []
atts['date'] = str(datetime.datetime.today().date())
atts['post_title'] = "Preview"

blog = []
links = []

def byTitle_key(blog):
    return blog['title']

with(open(os.path.join(TEMPLATE_DIR, 'page.j2'))) as t:
    PAGE_TEMPLATE = Template(t.read())
    
with(open(os.path.join(TEMPLATE_DIR, 'post.j2'))) as t:
    POST_TEMPLATE = Template(t.read())

def get_pages():
    for entry in os.scandir(PAGE_DIR):
        if all([
            not entry.name.startswith('.'),
            entry.name.endswith('.md'),
            entry.is_file()
        ]):
            yield entry.name

def get_posts():
    for entry in os.scandir(POST_DIR):
        if all([
            not entry.name.startswith('.'),
            entry.name.endswith('.md'),
            entry.is_file()
        ]):
            yield entry.name 
            
def generate_html():
    for att in CONFIG:
        atts[att] = CONFIG[att]
        
    # Generate the HTML for posts and prepare variables for get_pages
    for x in get_posts():
        atts['date'] = str(datetime.datetime.today().date())
        atts['post_title'] = "Preview"
        with open(os.path.join(POST_DIR, x)) as f:
            if os.path.isfile(os.path.join(BASE_DIR, POST_DIR, x.split('.')[0] + ".json")):
                with open(os.path.join(BASE_DIR, POST_DIR, x.split('.')[0] + '.json')) as s:
                    j = json.load(s)
                    t = j['layout']
                    if t == 'default':
                        template = POST_TEMPLATE

                        atts['post_title'] = j['title']
                        atts['date'] = j['date']
                    else:
                        template = Template(t.read())

                        atts['post_title'] = j['title']
                        atts['date'] = j['date']
                        
            else:
                template = POST_TEMPLATE

            atts['content'] = mistune.markdown(f.read())

        new_filename = atts['date'] + '_' + os.path.splitext(x)[0] + '.html'
        
        open(os.path.join(OUTPUT_DIR, BLOG_DIR, new_filename), 'w').write(template.render(atts))

        atts['blog'].append({'title': atts['date'] + ' / ' + atts['post_title'],
                             'link': 'posts/' + atts['date'] + '_' + atts['post_title'].replace(' ', '-') + '.html'})

    atts['blog'] = sorted(atts['blog'], key = byTitle_key, reverse = True)
        
    # Generate the HTML for pages
    for x in get_pages():
        with open(os.path.join(PAGE_DIR, x)) as f:
            if os.path.isfile(os.path.join(BASE_DIR, PAGE_DIR, x.split('.')[0] + ".json")):
                with(open(os.path.join(BASE_DIR, PAGE_DIR, x.split('.')[0] + '.json'))) as s:
                    j = json.load(s)
                    t = j['layout']
                    if t == 'default':
                        template = PAGE_TEMPLATE

                    else:
                        template = Template(open(os.path.join(TEMPLATE_DIR, t + '.j2')).read())
                
            content = f.read()
            atts['content'] = mistune.markdown(content) 

        new_filename = os.path.splitext(x)[0] + '.html'
        
        open(os.path.join(OUTPUT_DIR, new_filename), 'w').write(template.render(atts))

def main():        
    if not os.path.exists(OUTPUT_DIR):
        os.mkdir(OUTPUT_DIR)
    if not os.path.exists(BLOG_DIR):
        os.mkdir(BLOG_DIR)
    
    for entry in os.scandir(STYLES_DIR):
        if all([
            not entry.name.startswith('.'),
            entry.name.endswith('.css'),
            entry.is_file()
        ]):
            copyfile(os.path.join(STYLES_DIR, entry.name), os.path.join(OUTPUT_DIR, entry.name))
            copyfile(os.path.join(STYLES_DIR, entry.name), os.path.join(BLOG_DIR, entry.name))
        
    generate_html()

if __name__ == '__main__':
    main()

