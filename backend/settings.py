import configparser
import os

config = configparser.ConfigParser()
path = '/'.join((os.path.abspath(__file__).replace('\\', '/')).split('/')[:-1])
config.read(os.path.join(path, 'credential/credential.ini'))

OpenAI_Key = config['OpenAI']['OpenAI_Key']
OpenAI_Model = config['OpenAI']['OpenAI_Model']

Google_Map_Key = config['GoogleMap']['Google_Map_key']
