package com.movieticket.app.utils;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Expression;

public class CriteriaBuilderUtil {
	@SafeVarargs
	public static Expression<String> concat(CriteriaBuilder cb, String separator, Expression<String>... expressions) {
	    if (expressions.length == 0) {
	        return cb.literal("");
	    }

	    Expression<String> result = expressions[0];
	    for (int i = 1; i < expressions.length; i++) {
	        result = cb.concat(result, cb.concat(separator, expressions[i]));
	    }
	    return result;
	}
}
