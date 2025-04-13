package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.EditionResultsTestSamples.*;
import static com.mycompany.myapp.domain.GoalTestSamples.*;
import static com.mycompany.myapp.domain.ParticipantTestSamples.*;
import static com.mycompany.myapp.domain.ScoreTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EditionResultsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EditionResults.class);
        EditionResults editionResults1 = getEditionResultsSample1();
        EditionResults editionResults2 = new EditionResults();
        assertThat(editionResults1).isNotEqualTo(editionResults2);

        editionResults2.setId(editionResults1.getId());
        assertThat(editionResults1).isEqualTo(editionResults2);

        editionResults2 = getEditionResultsSample2();
        assertThat(editionResults1).isNotEqualTo(editionResults2);
    }

    @Test
    void participantTest() {
        EditionResults editionResults = getEditionResultsRandomSampleGenerator();
        Participant participantBack = getParticipantRandomSampleGenerator();

        editionResults.setParticipant(participantBack);
        assertThat(editionResults.getParticipant()).isEqualTo(participantBack);

        editionResults.participant(null);
        assertThat(editionResults.getParticipant()).isNull();
    }

    @Test
    void scoreTest() {
        EditionResults editionResults = getEditionResultsRandomSampleGenerator();
        Score scoreBack = getScoreRandomSampleGenerator();

        editionResults.addScore(scoreBack);
        assertThat(editionResults.getScores()).containsOnly(scoreBack);
        assertThat(scoreBack.getResult()).isEqualTo(editionResults);

        editionResults.removeScore(scoreBack);
        assertThat(editionResults.getScores()).doesNotContain(scoreBack);
        assertThat(scoreBack.getResult()).isNull();

        editionResults.scores(new HashSet<>(Set.of(scoreBack)));
        assertThat(editionResults.getScores()).containsOnly(scoreBack);
        assertThat(scoreBack.getResult()).isEqualTo(editionResults);

        editionResults.setScores(new HashSet<>());
        assertThat(editionResults.getScores()).doesNotContain(scoreBack);
        assertThat(scoreBack.getResult()).isNull();
    }

    @Test
    void goalTest() {
        EditionResults editionResults = getEditionResultsRandomSampleGenerator();
        Goal goalBack = getGoalRandomSampleGenerator();

        editionResults.addGoal(goalBack);
        assertThat(editionResults.getGoals()).containsOnly(goalBack);
        assertThat(goalBack.getResult()).isEqualTo(editionResults);

        editionResults.removeGoal(goalBack);
        assertThat(editionResults.getGoals()).doesNotContain(goalBack);
        assertThat(goalBack.getResult()).isNull();

        editionResults.goals(new HashSet<>(Set.of(goalBack)));
        assertThat(editionResults.getGoals()).containsOnly(goalBack);
        assertThat(goalBack.getResult()).isEqualTo(editionResults);

        editionResults.setGoals(new HashSet<>());
        assertThat(editionResults.getGoals()).doesNotContain(goalBack);
        assertThat(goalBack.getResult()).isNull();
    }
}
