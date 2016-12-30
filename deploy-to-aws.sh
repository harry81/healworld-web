echo "Step 1 : Building code."
npm run build --prod

echo "Step 2: Putting to AWS."
aws s3 sync  www s3://www.healworld.co.kr/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --profile pointer --region ap-northeast-2;

echo "Step 3: Invalidating cloudfront"
aws cloudfront create-invalidation --invalidation-batch file://invbatch.json --distribution-id=E1WSE4OG309BMK
