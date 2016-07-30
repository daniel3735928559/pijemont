"""
Can be run with

    cd /path/to/pijemont
    py.test

The following command will print sys.stdout

    py.test -s

"""

import json, sys, yaml
sys.path.append('..')
from pijemont import verifier


def run_test(test_name):
    with open('tests/{}.yaml'.format(test_name)) as f:
        test = yaml.load(f.read())
    api, errs = verifier.load_doc(test['spec'], 'tests/specs/')
    for x in test['inputs']:
        fn = test['inputs'][x]['function']
        args = test['inputs'][x]['args']
        out = verifier.verify(args, api[fn]['args'])
        assert out == args


def test_all():
    print('\n')
    for yaml_filename in ['basic', 'optional', 'string_num',
                          'overwrite_optional']:
        print('Testing YAML file {}'.format(yaml_filename))
        run_test(yaml_filename)
