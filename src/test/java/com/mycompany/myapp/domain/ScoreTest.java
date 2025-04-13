package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EditionResultsTestSamples.*;
import static com.mycompany.myapp.domain.ScoreTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ScoreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Score.class);
        Score score1 = getScoreSample1();
        Score score2 = new Score();
        assertThat(score1).isNotEqualTo(score2);

        score2.setId(score1.getId());
        assertThat(score1).isEqualTo(score2);

        score2 = getScoreSample2();
        assertThat(score1).isNotEqualTo(score2);
    }

    @Test
    void resultTest() {
        Score score = getScoreRandomSampleGenerator();
        EditionResults editionResultsBack = getEditionResultsRandomSampleGenerator();

        score.setResult(editionResultsBack);
        assertThat(score.getResult()).isEqualTo(editionResultsBack);

        score.result(null);
        assertThat(score.getResult()).isNull();
    }
}
