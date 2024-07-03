package com.movieticket.app.utils;

import java.util.Locale;

import com.github.slugify.Slugify;

public class SlugUtil {
	
	public static String generate(String input) {
		return new Slugify(Locale.US).slugify(input) + "-" + System.currentTimeMillis();
	}
}
