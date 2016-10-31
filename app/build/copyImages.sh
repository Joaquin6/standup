#!/bin/bash
# --------defines--------
path_src=./app/images
path_gen_src=$path_src/generic
path_soc_src=$path_src/socialicons
path_sui_src=$path_src/semantic

path_dst=./release/images
path_gen_dest=$path_dst/generic
path_soc_dest=$path_dst/socialicons
path_sui_dest=$path_dst/semantic

mkdir $path_dst
mkdir $path_gen_dest
mkdir $path_soc_dest
mkdir $path_sui_dest

cp $path_src/* $path_dst
cp $path_gen_src/* $path_gen_dest
cp $path_soc_src/* $path_soc_dest
cp $path_sui_src/* $path_sui_dest
