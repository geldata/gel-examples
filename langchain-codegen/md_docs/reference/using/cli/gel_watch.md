# gel watch

Start a long-running process that watches for changes as specified in the gel.toml file. This process will monitor the project for changes specified in the [[watch]] table array and run the associated scripts in response to those changes.

When multiple changes target the same [[watch]] element, the corresponding script will be triggered only once. All triggered watch scripts will be executed in parallel. If the same script is triggered before it finishes executing, the next execution will wait for the already running script to terminate (i.e. only one instance of the same script will be runing at the same time).

Any output that the triggered scripts produce will be shown in the gel watch console. This includes any error messages. So if you’re not seeing a change you’ve expected, check on the watch process to make sure there aren’t any unexpected errors in the triggered scripts.

## Options

