package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Score;
import com.mycompany.myapp.repository.ScoreRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Score}.
 */
@RestController
@RequestMapping("/api/scores")
@Transactional
public class ScoreResource {

    private static final Logger LOG = LoggerFactory.getLogger(ScoreResource.class);

    private static final String ENTITY_NAME = "score";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ScoreRepository scoreRepository;

    public ScoreResource(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    /**
     * {@code POST  /scores} : Create a new score.
     *
     * @param score the score to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new score, or with status {@code 400 (Bad Request)} if the score has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Score> createScore(@Valid @RequestBody Score score) throws URISyntaxException {
        LOG.debug("REST request to save Score : {}", score);
        if (score.getId() != null) {
            throw new BadRequestAlertException("A new score cannot already have an ID", ENTITY_NAME, "idexists");
        }
        score = scoreRepository.save(score);
        return ResponseEntity.created(new URI("/api/scores/" + score.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, score.getId().toString()))
            .body(score);
    }

    /**
     * {@code PUT  /scores/:id} : Updates an existing score.
     *
     * @param id the id of the score to save.
     * @param score the score to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated score,
     * or with status {@code 400 (Bad Request)} if the score is not valid,
     * or with status {@code 500 (Internal Server Error)} if the score couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Score> updateScore(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Score score)
        throws URISyntaxException {
        LOG.debug("REST request to update Score : {}, {}", id, score);
        if (score.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, score.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        score = scoreRepository.save(score);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, score.getId().toString()))
            .body(score);
    }

    /**
     * {@code PATCH  /scores/:id} : Partial updates given fields of an existing score, field will ignore if it is null
     *
     * @param id the id of the score to save.
     * @param score the score to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated score,
     * or with status {@code 400 (Bad Request)} if the score is not valid,
     * or with status {@code 404 (Not Found)} if the score is not found,
     * or with status {@code 500 (Internal Server Error)} if the score couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Score> partialUpdateScore(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Score score
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Score partially : {}, {}", id, score);
        if (score.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, score.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!scoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Score> result = scoreRepository
            .findById(score.getId())
            .map(existingScore -> {
                if (score.getValue() != null) {
                    existingScore.setValue(score.getValue());
                }
                if (score.getSubject() != null) {
                    existingScore.setSubject(score.getSubject());
                }

                return existingScore;
            })
            .map(scoreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, score.getId().toString())
        );
    }

    /**
     * {@code GET  /scores} : get all the scores.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of scores in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Score>> getAllScores(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Scores");
        Page<Score> page = scoreRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /scores/:id} : get the "id" score.
     *
     * @param id the id of the score to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the score, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Score> getScore(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Score : {}", id);
        Optional<Score> score = scoreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(score);
    }

    /**
     * {@code DELETE  /scores/:id} : delete the "id" score.
     *
     * @param id the id of the score to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScore(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Score : {}", id);
        scoreRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
