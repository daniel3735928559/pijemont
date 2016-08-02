"""
Can be run with

    cd /path/to/pijemont
    py.test

The following command will print sys.stdout

    py.test -s

"""

import json, sys, yaml, os
from pprint import pprint
import pytest
sys.path.append('..')
from pijemont import verifier
from numpy.testing import assert_raises


def verify_yaml(test_name, test):
    """
    This function does the actual work of verifying the YAML. It reads the spec
    in, formats the args (loaded from test_files/{test_name}) then returns both
    """
    api, errs = verifier.load_doc(test['spec'], 'tests/specs/')
    fn = test['inputs'][test_name]['function']
    args = test['inputs'][test_name]['args']
    verified = verifier.verify(args, api[fn]['args'])
    expected_out = test['inputs'][test_name]['verified']
    return verified, expected_out


def run_test(filename):
    """
    Given a filename, this function runs the test specified in that file.

    It catches Exceptions raised and prints out each test it's doing.
    """
    with open('tests/test_files/{}'.format(filename)) as f:
        test = yaml.load(f.read())
    for test_name in test['inputs']:
        print('    {}'.format(test_name))
        if test['load_errors'] != []:
            for exception in test['load_errors']:
                assert_raises(eval(exception), verify_yaml, test)
        else:
            try:
                args, expected_out = verify_yaml(test_name, test)
                assert expected_out == args
                assert (not 'errors' in test['inputs'][test_name]) or test['inputs'][test_name]['errors'] == False
            except:
                assert 'errors' in test['inputs'][test_name] and test['inputs'][test_name]['errors'] == True


def test_all():
    """
    Loop over all the files in tests/test_files and run all of them.
    """
    print('\n')
    dir_ = 'tests/test_files/'
    for yaml_filename in os.listdir(dir_):
        if 'DS_Store' in yaml_filename:
            continue
        print('Testing YAML file {}'.format(yaml_filename))
        run_test(yaml_filename)

if __name__ == "__main__":
    test_all()
