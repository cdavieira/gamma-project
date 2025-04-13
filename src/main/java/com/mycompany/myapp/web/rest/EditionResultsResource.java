package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.EditionResults;
import com.mycompany.myapp.repository.EditionResultsRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.EditionResults}.
 */
@RestController
@RequestMapping("/api/edition-results")
@Transactional
public class EditionResultsResource {

    private static final Logger LOG = LoggerFactory.getLogger(EditionResultsResource.class);

    private static final String ENTITY_NAME = "editionResults";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EditionResultsRepository editionResultsRepository;

    public EditionResultsResource(EditionResultsRepository editionResultsRepository) {
        this.editionResultsRepository = editionResultsRepository;
    }

    /**
     * {@code POST  /edition-results} : Create a new editionResults.
     *
     * @param editionResults the editionResults to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new editionResults, or with status {@code 400 (Bad Request)} if the editionResults has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<EditionResults> createEditionResults(@Valid @RequestBody EditionResults editionResults)
        throws URISyntaxException {
        LOG.debug("REST request to save EditionResults : {}", editionResults);
        if (editionResults.getId() != null) {
            throw new BadRequestAlertException("A new editionResults cannot already have an ID", ENTITY_NAME, "idexists");
        }
        editionResults = editionResultsRepository.save(editionResults);
        return ResponseEntity.created(new URI("/api/edition-results/" + editionResults.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, editionResults.getId().toString()))
            .body(editionResults);
    }

    /**
     * {@code PUT  /edition-results/:id} : Updates an existing editionResults.
     *
     * @param id the id of the editionResults to save.
     * @param editionResults the editionResults to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editionResults,
     * or with status {@code 400 (Bad Request)} if the editionResults is not valid,
     * or with status {@code 500 (Internal Server Error)} if the editionResults couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<EditionResults> updateEditionResults(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody EditionResults editionResults
    ) throws URISyntaxException {
        LOG.debug("REST request to update EditionResults : {}, {}", id, editionResults);
        if (editionResults.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editionResults.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editionResultsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        editionResults = editionResultsRepository.save(editionResults);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editionResults.getId().toString()))
            .body(editionResults);
    }

    /**
     * {@code PATCH  /edition-results/:id} : Partial updates given fields of an existing editionResults, field will ignore if it is null
     *
     * @param id the id of the editionResults to save.
     * @param editionResults the editionResults to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated editionResults,
     * or with status {@code 400 (Bad Request)} if the editionResults is not valid,
     * or with status {@code 404 (Not Found)} if the editionResults is not found,
     * or with status {@code 500 (Internal Server Error)} if the editionResults couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<EditionResults> partialUpdateEditionResults(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody EditionResults editionResults
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update EditionResults partially : {}, {}", id, editionResults);
        if (editionResults.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, editionResults.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!editionResultsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<EditionResults> result = editionResultsRepository
            .findById(editionResults.getId())
            .map(existingEditionResults -> {
                if (editionResults.getYear() != null) {
                    existingEditionResults.setYear(editionResults.getYear());
                }

                return existingEditionResults;
            })
            .map(editionResultsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, editionResults.getId().toString())
        );
    }

    /**
     * {@code GET  /edition-results} : get all the editionResults.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of editionResults in body.
     */
    @GetMapping("")
    public ResponseEntity<List<EditionResults>> getAllEditionResults(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of EditionResults");
        Page<EditionResults> page;
        if (eagerload) {
            page = editionResultsRepository.findAllWithEagerRelationships(pageable);
        } else {
            page = editionResultsRepository.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /edition-results/:id} : get the "id" editionResults.
     *
     * @param id the id of the editionResults to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the editionResults, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<EditionResults> getEditionResults(@PathVariable("id") Long id) {
        LOG.debug("REST request to get EditionResults : {}", id);
        Optional<EditionResults> editionResults = editionResultsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(editionResults);
    }

    /**
     * {@code DELETE  /edition-results/:id} : delete the "id" editionResults.
     *
     * @param id the id of the editionResults to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEditionResults(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete EditionResults : {}", id);
        editionResultsRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
