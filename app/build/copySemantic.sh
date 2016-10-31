#!/bin/bash
# --------defines--------
path_src=./app/build/semantic

path_dest=./node_modules/semantic

mkdir -p $path_dest

cp $path_src/* $path_dest
