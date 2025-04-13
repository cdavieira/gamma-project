package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class EditionResultsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static EditionResults getEditionResultsSample1() {
        return new EditionResults().id(1L).year(1);
    }

    public static EditionResults getEditionResultsSample2() {
        return new EditionResults().id(2L).year(2);
    }

    public static EditionResults getEditionResultsRandomSampleGenerator() {
        return new EditionResults().id(longCount.incrementAndGet()).year(intCount.incrementAndGet());
    }
}
