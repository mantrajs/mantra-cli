# Release guide
# 1. bump version in `package.json`
# 2. run `./release.sh [version_number]`
#
# This script will add, commit, tag, and push changes
#

version="$1"

if [ -z "$1" ]; then
  echo "Please specify the version number. e.g. 0.3.1"
  echo "Do not include the leading 'v'."
  exit 1
fi

git add .
git commit -m "$1"
git tag -a v"$1" -m "See RELEASE_NOTE.md for changes"
git push --follow-tags
npm publish
