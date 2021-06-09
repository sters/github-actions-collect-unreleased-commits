# github-actions-collect-unreleased-commits

## Inputs

|Value|Description|
|---|---|
|workspace|Collect git log for this workspace path.|
|mode|Collect method. Details are below.|
|format|Message format at each commits. Details are below.|

## Supported `mode`

|Mode              |Description                               |
|------------------|------------------------------------------|
|only-pull-requests|Includes only `#xx` style commit messages.|
|only-merge-commit |Includes only `Merge` commit.             |
|all-commit        |Includes all commit.                      |

## Supported `format`

`format` supports this syntax like template literals.

```
${subject}
```

|Values|Description|
|---|---|
|subject|commit message|
|authorName|commit's author name|
|hash|commit hash|
|abbrevHash|shorthand commit hash number|
