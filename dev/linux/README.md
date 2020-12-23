##### Instructions
1. Clone `leanes-cli` into a folder under `C:/Users` in Windows or `/Users` in Mac
1. Install Docker on [Windows](https://github.com/boot2docker/windows-installer/releases/latest) or [Mac](https://github.com/boot2docker/osx-installer/releases/latest)
1. Start Boot2Docker
1. `cd` into your cloned `leanes-cli` folder
1. Run `cd dev/linux`
1. Run `docker build -t leanes-cli .`
1. Run `docker run -ti --rm=true leanes-cli`
1. Run `cd ~/leanes-cli`
1. Run `npm run-script test-all`
1. When you're done, run `exit`

##### Cleanup
1. Run `docker rmi leanes-cli`
