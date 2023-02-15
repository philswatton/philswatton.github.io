---
layout: default
title: git-reference
---

# Git Reference

This is a short reference sheet of git commands. I wrote it for my own uses as I frequently forget the commands I should be using. This reference assumes that you'll be using GitHub as a remote repository.

## Initialising a repository

Initialise a repository
```
git init
```

## Branch Management

Create a branch called `main` and switch to it. Note you'll need to do this when creating the repository for the first time. Branch names should align with github branch names.
```
git checkout -b main
```

Switch current working branch to `main`.
```
git checkout main
```

List existing branches on your machine
```
git branch
```

Delete a branch called `implement_issue`
```
git branch -D implement_issue
```

## Remote Management

Add remote origin. Copy SSH from github and replace as appropriate below
```
git remote add origin git@github.com:username/repo.git
```

## Staging and Committing

Stage changes to `file`
```
git add file
```

Commit changes with message
```
git commit -m "Message"
```

Check repo status. Add `--ignored` to include ignored files.
```
git status
```

Check repo conents difference. Add `--staged` to check vs staged changes.
```
git diff
```

## Reverting Commits

Move back 1 commit. For >1 commit reverted, set `HEAD~3` for 3 commits back, etc. Set `--hard` to throw away uncommitted changes. Set `--soft` to leave comitted changes staged.
```
git reset HEAD~1
```


## Pushing and Pulling from Github

Push and pull from origin. Note that `origin` does not need to be `main`

```
git push origin main
git pull origin main
```


## Setting up Git on a new laptop

Set username and email as global
```
git config --global user.name "Some Username"
git config --global user.email "example@email.io"
```

Set default branch to be main globally
```
git config --global init.defaultBranch main
```


## Setting up SSH for Github

Create SSH key. Optionally enter and confirm a passphrase. Copy key from `~/.ssh/id_ed25519.pub`
```
ssh-keygen -t ed25519 -C "example@email.io"
```

Check that GitHub is authenticated
```
ssh -T git@github.com
```