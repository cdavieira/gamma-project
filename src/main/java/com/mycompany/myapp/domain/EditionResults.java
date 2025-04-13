package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A EditionResults.
 */
@Entity
@Table(name = "edition_results")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class EditionResults implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 1998)
    @Max(value = 2026)
    @Column(name = "year", nullable = false)
    private Integer year;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value = { "user", "results" }, allowSetters = true)
    private Participant participant;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "result")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "result" }, allowSetters = true)
    private Set<Score> scores = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "result")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "result" }, allowSetters = true)
    private Set<Goal> goals = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public EditionResults id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYear() {
        return this.year;
    }

    public EditionResults year(Integer year) {
        this.setYear(year);
        return this;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Participant getParticipant() {
        return this.participant;
    }

    public void setParticipant(Participant participant) {
        this.participant = participant;
    }

    public EditionResults participant(Participant participant) {
        this.setParticipant(participant);
        return this;
    }

    public Set<Score> getScores() {
        return this.scores;
    }

    public void setScores(Set<Score> scores) {
        if (this.scores != null) {
            this.scores.forEach(i -> i.setResult(null));
        }
        if (scores != null) {
            scores.forEach(i -> i.setResult(this));
        }
        this.scores = scores;
    }

    public EditionResults scores(Set<Score> scores) {
        this.setScores(scores);
        return this;
    }

    public EditionResults addScore(Score score) {
        this.scores.add(score);
        score.setResult(this);
        return this;
    }

    public EditionResults removeScore(Score score) {
        this.scores.remove(score);
        score.setResult(null);
        return this;
    }

    public Set<Goal> getGoals() {
        return this.goals;
    }

    public void setGoals(Set<Goal> goals) {
        if (this.goals != null) {
            this.goals.forEach(i -> i.setResult(null));
        }
        if (goals != null) {
            goals.forEach(i -> i.setResult(this));
        }
        this.goals = goals;
    }

    public EditionResults goals(Set<Goal> goals) {
        this.setGoals(goals);
        return this;
    }

    public EditionResults addGoal(Goal goal) {
        this.goals.add(goal);
        goal.setResult(this);
        return this;
    }

    public EditionResults removeGoal(Goal goal) {
        this.goals.remove(goal);
        goal.setResult(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof EditionResults)) {
            return false;
        }
        return getId() != null && getId().equals(((EditionResults) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "EditionResults{" +
            "id=" + getId() +
            ", year=" + getYear() +
            "}";
    }
}
