#!/bin/bash
#set -xv

# Tell Jenkins how to build fs.site into a Docker Image
project=firestarter
image=fs.app
# Get the tag from Jenkins getting it from Github
tag=$1
# MUST use quotes ("") around usage of commands with more than a single word (SEE COMMAND BELOW)
compileCommand="npm start"
compileFolder="_dev"
compileImage=d.lbox.com/leroy/site.builder
# build directory is root that contains the Dockerfile so ignore parameter
#buildDir=

# sudo fs.build --project $project --image $image --tag $tag --compile "$compileCommand" --compile-folder $compileFolder

sudo fs.build --project firestarter --image fs.app --tag "test" --compile "npm start"
