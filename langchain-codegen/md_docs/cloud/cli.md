# CLI

To use Gel Cloud via the CLI, first log in using gel cloud login.

This is the way you’ll log in interactively on your development machine, but when interacting with Gel Cloud via a script or in CI, you’ll instead set the GEL_SECRET_KEY environment variable to your secret key. Generate a secret key in the Gel Cloud UI or by running gel cloud secretkey create. The gel cloud login and gel cloud logout commands are not intended for use in this context.

Once your login is successful, you will be able to create an instance using either gel instance create or gel project init, depending on whether you also want to create a local project linked to your instance.

Please be aware of the following restrictions on Gel Cloud instance names: can contain only Latin alpha-numeric characters or - cannot start with a dash (-) or contain double dashes (--) maximum instance name length is 61 characters minus the length of your organization name (i.e., length of organization name + length of instance name must be fewer than 62 characters)

To use gel instance create:

```bash
$ gel instance create <org-name>/<instance-name>
```

To use gel project init:

```bash
$ gel project init \
  --server-instance <org-name>/<instance-name>
```

Alternatively, you can run gel project init without the --server-instance option and enter an instance name in the <org-name>/<instance-name> format when prompted interactively.

