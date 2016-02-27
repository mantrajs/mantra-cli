#!/bin/bash
set -e

appPath=$1

# Create a Meteor app
meteor create "$appPath" --release 1.3-beta.11
cd "$appPath"

# Remove the default files genereated by Meteor
rm *.css *.html *.js

# Add package dependencies
echo 'kadira:flow-router' >> .meteor/packages
echo 'aldeed:collection2' >> .meteor/packages
