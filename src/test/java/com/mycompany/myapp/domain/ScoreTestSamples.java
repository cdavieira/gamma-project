package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ScoreTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Score getScoreSample1() {
        return new Score().id(1L).value(1);
    }

    public static Score getScoreSample2() {
        return new Score().id(2L).value(2);
    }

    public static Score getScoreRandomSampleGenerator() {
        return new Score().id(longCount.incrementAndGet()).value(intCount.incrementAndGet());
    }
}
