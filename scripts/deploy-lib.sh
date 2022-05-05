#!/bin/bash

function try {
	"$@"
	local status=$?
	if [ $status -ne 0 ]; then
		echo "!!!Error!!! with $1" >&2
		exit $status
	fi
	return $status
}

rm -rf build/
try npm run build-lib
try cp package-lib.json build/lib/package.json
try cd build/lib
npm publish
