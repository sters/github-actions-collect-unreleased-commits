# github-actions-collect-unreleased-commits

This action collects

## Inputs

|Value    |Default           |Required|Description                                                                                                                  |
|---------|------------------|--------|-----------------------------------------------------------------------------------------------------------------------------|
|workspace|                  |true    |Collect git log for this workspace path.                                                                                     |
|mode     |only-pull-requests|false   |Collect method. Details are below.                                                                                           |
|format   |%s                |false   |Message format that the same as git log format option. See this [document](https://git-scm.com/docs/git-log#_pretty_formats).|

## Outputs

|Value     |Description                |
|----------|---------------------------|
|latest-tag|The latest tag.            |
|commits   |The unreleased commit list.|

## Supported `mode`

|Mode              |Description                               |
|------------------|------------------------------------------|
|only-pull-requests|Includes only `#xx` style commit messages.|
|only-merge-commit |Includes only `Merge` commit.             |
|all-commit        |Includes all commit.                      |
