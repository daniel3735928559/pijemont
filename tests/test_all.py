"""
Can be run with

    cd /path/to/pijemont
    py.test

The following command will print sys.stdout

    py.test -s

"""

import json, sys, yaml, os
from pprint import pprint
sys.path.append('..')
from pijemont import verifier


def run_test(test_name):
    with open('tests/test_files/{}'.format(test_name)) as f:
        test = yaml.load(f.read())
    api, errs = verifier.load_doc(test['spec'], 'tests/specs/')
    for x in test['inputs']:
        fn = test['inputs'][x]['function']
        args = test['inputs'][x]['args']
        verifier.verify(args, api[fn]['args'])

        expected_out = test['inputs'][x]['verified']

        assert expected_out == args


def test_all():
    print('\n')
    dir_ = 'tests/test_files/'
    for yaml_filename in os.listdir(dir_):
        print('Testing YAML file {}'.format(yaml_filename))
        run_test(yaml_filename)
