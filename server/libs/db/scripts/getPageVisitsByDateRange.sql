SELECT body FROM analytics.pagevisits
	WHERE body ->> 'date' >= $1
		AND body ->> 'date' <= $2;