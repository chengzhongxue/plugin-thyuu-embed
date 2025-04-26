package com.kunkunyu.embed.service;

import lombok.Data;
import reactor.core.publisher.Mono;

public interface SettingConfig {

    /**
     * Never {@link Mono#empty()}.
     */
    Mono<BasicConfig> getBasicConfig();

    @Data
    class BasicConfig {
        public static final String GROUP = "basic";
        private boolean staticEnable;
    }
}
