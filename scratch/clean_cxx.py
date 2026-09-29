import os
import shutil

for root, dirs, files in os.walk(r'M:'):
    if '.cxx' in dirs:
        cxx_path = os.path.join(root, '.cxx')
        try:
            print(f'Removing {cxx_path}')
            shutil.rmtree(cxx_path, ignore_errors=True)
        except Exception as e:
            print(f'Failed {cxx_path}: {e}')
print('Done cleaning .cxx')
