# -*- coding: utf-8 -*-
import re
import json
from fabric.api import local

def deploy_to_aws():
    print 'Step 1 : version up'
    version_up()

    print 'Step 2 : Building code.'
    build()

    print 'Step 3 : Putting to AWS.'
    copy_to_aws()

    print 'Step 4 : Invalidating cloudfront.'
    invalidate_cloudfront()

def build():
    local("ionic build")

def copy_to_aws():
    local("aws s3 sync  www s3://www.healworld.co.kr/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --profile pointer --region ap-northeast-2;")

def invalidate_cloudfront():
    local("aws cloudfront create-invalidation --invalidation-batch file://invbatch.json --distribution-id=E1WSE4OG309BMK")

def version_up():
    version_up_invbatch()
    version_up_service_worker()

def version_up_invbatch():
    with open('invbatch.json', 'rt') as fp:
        content= fp.read()

    content_json = json.loads(content)
    reference = content_json['CallerReference']
    reference = int(reference) + 1
    content_json['CallerReference'] = str(reference)

    with open('invbatch.json', 'wt') as fp:
        fp.write(json.dumps(content_json))


def version_up_service_worker():
    with open('src/service-worker.js', 'rt') as fp:
        content = fp.read()

    version = re.search(r'const CACHE_VERSION = (\d+)', content).group(1)
    version = int(version) + 1
    print "CACHE_VERSION = %d" % version
    content = re.sub(r'const CACHE_VERSION = (\d+)', r'const CACHE_VERSION = %d' % version, content)

    with open('src/service-worker.js', 'wt') as fp:
        fp.write(content)
