import json, sys, verifier, yaml

def run_test(test_name):
    with open('tests/{}.yaml'.format(test_name)) as f:
        test = yaml.load(f.read())
    print(test)
    api,errs = verifier.load_doc(test['spec'],'tests/specs/')
    for x in test['inputs']:
        print(x)
        fn = test['inputs'][x]['function']
        args = test['inputs'][x]['args']
        print(args)
        verifier.verify(args,api[fn]['args'])
    print(api,errs)
    
run_test('basic')
